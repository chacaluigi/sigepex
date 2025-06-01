import os
import requests
from datetime import datetime, timedelta
from app.config import X_API_KEY, X_API_SECRET
from app.database.mongodb import MongoDBClient
from typing import List, Dict

class XAPIFetcher:
    def __init__(self):
        self.base_url = "https://api.x.com/2"
        self.headers = {
            "Authorization": f"Bearer {X_API_KEY}",
            "Content-Type": "application/json"
        }
        self.db = MongoDBClient()

    def fetch_posts(self, keywords: List[str], lookback_days: int = 1) -> List[Dict]:
        """Extrae posts de la API de X basados en palabras clave"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=lookback_days)
        
        params = {
            "query": " OR ".join(keywords),
            "start_time": start_time.isoformat() + "Z",
            "end_time": end_time.isoformat() + "Z",
            "max_results": 500,
            "expansions": "author_id,attachments.media_keys",
            "tweet.fields": "created_at,public_metrics,source,context_annotations",
            "user.fields": "verified,public_metrics"
        }

        try:
            response = requests.get(
                f"{self.base_url}/tweets/search/recent",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return self._process_response(response.json())
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

    def _process_response(self, data: Dict) -> List[Dict]:
        """Estructura los datos para almacenamiento en MongoDB"""
        processed = []
        for tweet in data.get("data", []):
            user = next(
                (u for u in data.get("includes", {}).get("users", []) 
                 if u["id"] == tweet["author_id"]),
                {}
            )
            processed.append({
                "content": tweet["text"],
                "user_type": self._classify_user(user),
                "metrics": tweet["public_metrics"],
                "created_at": tweet["created_at"],
                "source": tweet.get("source", "unknown"),
                "media": self._extract_media(data, tweet),
                "processed": False  # Flag para minería de texto
            })
        return processed

    def _classify_user(self, user: Dict) -> str:
        """Clasifica usuarios jerárquicamente"""
        if user.get("verified"):
            return "media" if "news" in user.get("description", "").lower() else "journalist"
        return "citizen" if user.get("followers_count", 0) < 10000 else "influencer"

    def _extract_media(self, data: Dict, tweet: Dict) -> List[str]:
        """Extrae URLs de medios adjuntos"""
        media_keys = tweet.get("attachments", {}).get("media_keys", [])
        return [
            m["url"] for m in data.get("includes", {}).get("media", [])
            if m["media_key"] in media_keys and m["type"] == "photo"
        ]
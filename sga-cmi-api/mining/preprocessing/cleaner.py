import re
import string
from typing import List, Dict
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from app.config import CUSTOM_STOPWORDS

class TextCleaner:
    def __init__(self):
        self.stopwords = set(stopwords.words("spanish") + CUSTOM_STOPWORDS)
        self.url_pattern = re.compile(r"https?://\S+|www\.\S+")
        self.mention_pattern = re.compile(r"@\w+")
        self.punctuation = string.punctuation + "¿¡"

    def clean_post(self, post: Dict) -> Dict:
        """Aplica limpieza completa a un post"""
        text = post["content"]
        text = self._remove_urls(text)
        text = self._remove_mentions(text)
        text = self._remove_special_chars(text)
        text = self._normalize_case(text)
        
        return {
            **post,
            "clean_content": text,
            "cleaned": True
        }

    def _remove_urls(self, text: str) -> str:
        return self.url_pattern.sub("", text)

    def _remove_mentions(self, text: str) -> str:
        return self.mention_pattern.sub("", text)

    def _remove_special_chars(self, text: str) -> str:
        return text.translate(str.maketrans("", "", self.punctuation))

    def _normalize_case(self, text: str) -> str:
        return text.lower()

    def batch_clean(self, posts: List[Dict]) -> List[Dict]:
        """Procesamiento optimizado para lotes"""
        return [self.clean_post(p) for p in posts if not p.get("processed")]
import spacy
from typing import List, Dict
from app.config import SPACY_MODEL

class TextTokenizer:
    def __init__(self):
        self.nlp = spacy.load(SPACY_MODEL, disable=["parser", "ner"])
        
    def tokenize_post(self, post: Dict) -> Dict:
        """Aplica tokenización y lematización a un post limpio"""
        doc = self.nlp(post["clean_content"])
        tokens = [
            token.lemma_ for token in doc 
            if not token.is_stop and token.is_alpha
        ]
        
        return {
            **post,
            "tokens": tokens,
            "tokenized": True
        }

    def batch_tokenize(self, posts: List[Dict]) -> List[Dict]:
        """Procesamiento por lotes con spaCy para eficiencia"""
        texts = [p["clean_content"] for p in posts if p.get("cleaned") and not p.get("tokenized")]
        return [
            self.tokenize_post(p) 
            for p, doc in zip(posts, self.nlp.pipe(texts, batch_size=50))
        ]
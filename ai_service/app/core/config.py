import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PORT: int = int(os.getenv('PORT', 4000))
    HOST: str = os.getenv('HOST', '0.0.0.0')
    ENVIRONMENT: str = os.getenv('ENVIRONMENT', 'production')
    CORS_ORIGINS: list = os.getenv('CORS_ORIGINS', '*').split(',')
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    DEFAULT_LANGUAGE: str = os.getenv('DEFAULT_LANGUAGE', 'bn')
    DUPLICATE_THRESHOLD: float = float(os.getenv('DUPLICATE_THRESHOLD', 0.65))
    SPAM_CONFIDENCE_THRESHOLD: float = float(os.getenv('SPAM_CONFIDENCE_THRESHOLD', 80.0))
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY') or ''
    MODEL_NAME: str = os.getenv('MODEL_NAME', 'gemini-1.5-flash')

settings = Settings()

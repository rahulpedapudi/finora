import jwt
from jwt import PyJWKClient
from app.core.config import Config

# Cache the JWKS client — it fetches and caches public keys from Supabase
_jwks_client = None


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        jwks_url = f"{Config.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        _jwks_client = PyJWKClient(jwks_url, timeout=10)
    return _jwks_client


def verify_supabase_token(token: str) -> dict | None:
    """Verify a Supabase-issued JWT using the project's JWKS public keys.

    Supabase signs JWTs with ES256 (Elliptic Curve P-256).
    The public key is fetched from the JWKS endpoint and cached.
    """
    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
        return payload
    except jwt.exceptions.PyJWTError:
        return None

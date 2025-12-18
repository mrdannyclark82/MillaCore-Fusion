from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import os

def encrypt(key: bytes, plaintext: bytes) -> str:
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ct = cipher.encrypt(pad(plaintext, AES.block_size))
    return base64.b64encode(iv + ct).decode("utf-8")

def decrypt(key: bytes, token: str) -> bytes:
    data = base64.b64decode(token)
    iv = data[:16]
    ct = data[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size)

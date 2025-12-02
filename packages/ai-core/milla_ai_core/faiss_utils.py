# Placeholder FAISS helper
def load_index(path: str):
    """
    Load a FAISS index from the given path.
    Replace with the canonical implementation extracted from source repos.
    """
    try:
        import faiss
    except Exception:
        raise RuntimeError("faiss not installed; add to pyproject if needed")
    return faiss.read_index(path)

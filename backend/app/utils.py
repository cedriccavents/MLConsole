import numpy as np

def default(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj

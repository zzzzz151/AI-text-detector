import { useState } from 'react';

function useReadyState(): [(...what: Array<"success" | "error" | "loading" | "default">) => boolean, () => void, () => void, () => void, () => void] {
  const [state, setState] = useState(0);  

  const setSuccess = () => {
    setState(1)
  }

  const setError = () => {
    setState(-1)
  }

  const setLoading = () => {
    setState(2)
  }

  const reset = () => {
    setState(0)
  }

  const is = (...what: Array<"success" | "error" | "loading" | "default">) => {
    return what.some(w => {
      switch(w) {
        case "success":
          return state == 1;
        case "error":
          return state == -1;
        case "loading":
          return state == 2;
        case "default":
          return state == 0;
        default:
          return false;
      }
    });
  }

  return [is, setSuccess, setError, setLoading, reset];
}

export default useReadyState
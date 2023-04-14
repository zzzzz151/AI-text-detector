import { useState } from 'react';

function useReadyState(): [(...what: Array<"success" | "error" | "loading" | "default" | "reload">) => boolean, () => void, () => void, () => void, () => void, () => void] {
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

  const reload = () => {
    setState(3)
  }

  const reset = () => {
    setState(0)
  }

  const is = (...what: Array<"success" | "error" | "loading" | "default" | "reload">) => {
    return what.some(w => {
      switch(w) {
        case "success":
          return state == 1;
        case "error":
          return state == -1;
        case "loading":
          return state == 2;
        case "reload":
          return state == 3;
        case "default":
          return state == 0;
        default:
          return false;
      }
    });
  }

  return [is, setSuccess, setError, setLoading, reset, reload];
}

export default useReadyState
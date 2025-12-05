import{useState,useEffect}from'react';export function useFetch(fn){const[d,setD]=useState(null);useEffect(()=>{fn().then(setD)},[]);return d;}

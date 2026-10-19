import React from "react";
export default function NoticeBanner({ app }) {
 const { notice, setNotice, error, setError } = app;
 return (<>{notice&&<div className="notice success">{notice}<button onClick={()=>setNotice("")}>×</button></div>}{error&&<div className="notice error">{error}<button onClick={()=>setError("")}>×</button></div>}</>);
}

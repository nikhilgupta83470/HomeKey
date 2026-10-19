import React from "react";
export default function Field({label, name, value, onChange, type="text", options, required=false, placeholder=""}) {
 return <label className="field"><span>{label}{required?" *":""}</span>{options ?
  <select name={name} value={value||""} onChange={onChange} required={required}><option value="">Select</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select> :
  <input name={name} type={type} value={value||""} onChange={onChange} required={required} placeholder={placeholder}/>}</label>;
}

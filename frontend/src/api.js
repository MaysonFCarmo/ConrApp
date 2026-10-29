// Único ponto de comunicação com a API: trocar backend mock por PostgreSQL não altera as páginas.
export async function api(path,{token,method='GET',body}={}){
 const headers={};if(token)headers.Authorization=`Bearer ${token}`;
 if(body!==undefined)headers['Content-Type']='application/json';
 const response=await fetch(`/api${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
 let data;try{data=await response.json();}catch{data={};}
 if(!response.ok)throw new Error(data.error||`Falha HTTP ${response.status}`);
 return data;
}

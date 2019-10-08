export async function getNew() {
  let response = await fetch('https://audod.github.io/fintechsquad-fp2019/data/new_atms.json');
  let result = await response.json();
  return result; 
} 

export async function getOld() {
  let response = await fetch('https://audod.github.io/fintechsquad-fp2019/data/old_atms.json');
  let result = await response.json();
  return result; 
} 
    

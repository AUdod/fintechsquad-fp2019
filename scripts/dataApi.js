export async function getTest() {
  let response = await fetch('https://audod.github.io/fintechsquad-fp2019/data/new_atms.json');
  let result = await response.json();
  return result; 
} 
    

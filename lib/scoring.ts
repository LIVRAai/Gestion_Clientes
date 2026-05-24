export function pointsForPrediction(ph:number,pa:number,rh:number,ra:number){
  if(ph===rh&&pa===ra) return {points:3,exact:true,winner:true};
  const pDiff=Math.sign(ph-pa), rDiff=Math.sign(rh-ra);
  if(pDiff===rDiff) return {points:1,exact:false,winner:true};
  return {points:0,exact:false,winner:false};
}

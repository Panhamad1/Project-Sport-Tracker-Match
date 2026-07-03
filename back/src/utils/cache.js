const isCacheFresh = (lastUpdated, cacheMinutes = 30) =>{
    if(!lastUpdated){
        return false;
    }
    
    const lastTime = new Date(lastUpdated).getTime();
    const now = Date.now();

    const diffMinutes = (now - lastTime) / 1000 / 60;

    return diffMinutes < cacheMinutes; 
}
export default isCacheFresh;
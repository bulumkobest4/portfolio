window.addEventListener('load', async ()=>{
    // Get gainers and losers
    const alphaKey = 'B64D605SLJPD339R'
    const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${alphaKey}`
    const gainersLosers = await fetch(url).then(response => response.json())
    const gainers = gainersLosers.top_gainers
    const losers = gainersLosers.top_losers
    
    // Fill DOM with data
    const animationElement = document.querySelector('.slideAnimation')
    
    for(let i = 0; i < 10; i++){
        const span1 = document.createElement('span')
        const span2 = document.createElement('span')
        span1.textContent =  losers[i].ticker + ' ' + losers[i].change_amount
        span2.textContent = gainers[i].ticker + ' ' + gainers[i].change_amount
        span1.style.textAlign = 'center'
        span1.style.color = 'red'
        span2.style.color = 'green'
        span2.style.textAlign = 'center'
        animationElement.appendChild(span1)
        animationElement.appendChild(span2)

    }
})

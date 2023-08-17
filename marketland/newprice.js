window.addEventListener('load',async()=>{
    const pairs = ['GBPUSD','USDJPY','EURUSD']
    for(let pair of pairs){
        //Get news
        const pairNews = await relatedNews(pair) 
        const currentPrice = async (symbol) => {
            const fixSymbol = symbol.toString();
            const first = fixSymbol.slice(0, 3);
            const second = fixSymbol.slice(3);
            const correctSymbol = `${first}/${second}`;
            const url = `https://api.twelvedata.com/exchange_rate?symbol=${correctSymbol}&apikey=c93260e6e76a4c5e9504eccf2b9e61f3`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch exchange rate data: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        };
        // Get Current Price
        const current_price = await currentPrice(pair).then(data => data)
        const table = document.getElementById('table');
        const row = document.createElement('tr');
        const sym = document.createElement('td');
        sym.textContent = current_price['symbol']
        
        const current = document.createElement('td');
        current.textContent = current_price['rate'];
        
        // Get Prev High and low
        const historicalData = await getPriceData(pair).then(data => data['values'])
        const highPrice = historicalData[0]['high']
        const high = document.createElement('td')
        high.textContent = highPrice
        const lowPrice = historicalData[0]['low']
        const low = document.createElement('td');
        low.textContent = lowPrice
        // View More Button
        const viewBtnCell = document.createElement('td');
        const viewBtn = document.createElement('button')
        viewBtn.textContent = 'View More'
        viewBtn.addEventListener('click', async ()=>{
    
            const chartPlot = () =>{    
                const dataPoints = [];
                const chart = new CanvasJS.Chart("chartContainer", {
        
                    animationEnabled: true,
                    theme: "dark1",
                    exportEnabled: true,
                    title: {
                        text: `${sym.textContent} Daily Chart`
                    },
                    
                    axisX: {
                        interval: 1,
                        intervalType : 'day',
                        valueFormatString: "MMM-DD",
                        labelAngle : -80
                    },
                    axisY: {
                        
                        title: "Price"
                    },
                    toolTip: {
                        content: "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}"
                    }, data: [{
                        type: "candlestick",
                        yValueFormatString: "$###.###",
                        dataPoints: dataPoints
                    }]
                });
                for (let i = 0; i < historicalData.length; i++) {
                    const dataPoint = {
                        x: new Date(historicalData[i].datetime),
                        y: [
                            parseFloat(historicalData[i]['open']),
                            parseFloat(historicalData[i]['high']),
                            parseFloat(historicalData[i]['low']),
                            parseFloat(historicalData[i]['close'])
                        ]
                    };
                    dataPoints.push(dataPoint);
                }
                chart.render();
            }
            chartPlot()

            const newsContainer = document.querySelector('.related-news');

        
        
        // Get news that have a non-neutral sentiment
        const effectNews = pairNews.filter(news=> news['sentiment']!=='Neutral' && !(news['sentiment']).startsWith('Somewhat'))
        for( singleArticle of effectNews){
            const newsItem = document.createElement('div');
            newsItem.style.backgroundColor = 'rgba(233, 232, 232,.3)'
            newsItem.style.margin = '1em 0'
            newsItem.style.padding = '1em'
            newsItem.style.borderRadius = '.4em'
            newsItem.style.color = 'white'

            const articleTitle = singleArticle['title']
            const articleLink = singleArticle['link']
            const articleSentiment = singleArticle['sentiment']
            const articlePublish = singleArticle['time']
            const articleSummary = singleArticle['summary']

            // Elements

            const articleTitleEl = document.createElement('h2')
            articleTitleEl.textContent = articleTitle
            newsItem.appendChild(articleTitleEl)
            newsContainer.appendChild(newsItem)

            const articlePublishEl = document.createElement('span')
            articlePublishEl.textContent = articlePublish
            newsItem.appendChild(articlePublishEl)
            newsContainer.appendChild(newsItem)

            const articleSummaryEl = document.createElement('p')
            articleSummaryEl.textContent = articleSummary
            newsItem.appendChild(articleSummaryEl)
            newsContainer.appendChild(newsItem)

            const articleSentimentEl = document.createElement('p')
            articleSentimentEl.textContent = articleSentiment
            if(articleSentiment === 'Bullish'){
                articleSentimentEl.style.color = 'green'
            }else{
                articleSentimentEl.style.color = 'red'

            }
            newsItem.appendChild(articleSentimentEl)
            newsContainer.appendChild(newsItem)

            const articleLinkEl = document.createElement('a')
            articleLinkEl.textContent = 'Read More'
            articleLinkEl.href = articleLink
            newsItem.appendChild(articleLinkEl)
            newsContainer.appendChild(newsItem)

        }
    
        })
        viewBtnCell.appendChild(viewBtn)
        row.appendChild(sym)
        row.appendChild(current)
        row.appendChild(high)
        row.appendChild(low)
        row.appendChild(viewBtnCell)
        table.appendChild(row)
        
        // Show related news

        

        async function getPriceData(symbol){
            const fixSymbol = symbol.toString();
            const first = fixSymbol.slice(0, 3);
            const second = fixSymbol.slice(3);
            const correctSymbol = `${first}/${second}`;
            const prices = await fetch(`https://api.twelvedata.com/time_series?symbol=${correctSymbol}&interval=1day&apikey=c93260e6e76a4c5e9504eccf2b9e61f3`)
            .then(response => response.json())
            .then(data => data);
            return prices;
        }
        
        //Get related news
        async function relatedNews(symbol) {
            const fix = symbol.toString().split('');
            const base = fix.splice(0, 3).join('');
            const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=FOREX:${base}&apikey=YOUR_API_KEY`;
        
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data from Alpha Vantage: ${response.statusText}`);
                }
        
                const data = await response.json();
                const feed = data['feed'];
                if (!feed || feed.length === 0) {
                    throw new Error('No news feed data found.');
                }
        
                const processedFeed = feed.map(newsItem => {
                    const sentiment = newsItem['overall_sentiment_label'];
                    const link = newsItem['url'];
                    const title = newsItem['title'];
                    const summary = newsItem['summary'];
                    const time = newsItem['time_published'];
        
                    return {
                        sentiment,
                        link,
                        title,
                        summary,
                        time
                    };
                });
        
                return processedFeed;
            } catch (error) {
                console.error('An error occurred:', error);
                return null; // or throw error, depending on your use case
            }
        }    
    }
})


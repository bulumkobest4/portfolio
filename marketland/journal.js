window.onload = async()=>{
    const table = document.getElementById('table')
    let entries = JSON.parse(localStorage.getItem('entries')) || []
    let a
    console.log(entries)
    if(entries){
        entries.forEach(element => {
            const row = document.createElement('tr')
            const symbol = document.createElement('td')
            const open = document.createElement('td')
            const stop = document.createElement('td')
            const take = document.createElement('td')
            const removeBtn = document.createElement('button')
            removeBtn.textContent = 'Remove'
            symbol.textContent = element.symbol 
            open.textContent = element.open 
            stop.textContent = element.stop 
            stop.style.color = 'red'
            take.textContent = element.take
            take.style.color = 'green' 
            row.appendChild(symbol)
            row.appendChild(open)
            row.appendChild(stop)
            row.appendChild(take)
            row.appendChild(removeBtn)
            table.appendChild(row)
            removeBtn.addEventListener('click', ()=>{
                const entryPosition = entries.indexOf(element)
                entries.splice(entryPosition,1)
                localStorage.setItem('entries', JSON.stringify(entries))
                location.reload()

            })
        })
    }
    if(entries.length < 1){
        const recordsContainer = document.querySelector('.records')
        recordsContainer.innerHTML = '<h1 style="color:white;"> No data to show </h1>'
    }
    const addBtn = document.getElementsByTagName('button')[0]
    const inputs = document.getElementsByTagName('input')
    const symbol = inputs[0]
    const open = inputs[1]
    const stop = inputs[2]
    const take = inputs[3]
    
    addBtn.addEventListener('click', ()=>{
        const currentEntry = {}
        currentEntry.symbol = symbol.value
        currentEntry.open = open.value
        currentEntry.stop = stop.value
        currentEntry.take = take.value
        entries.push(currentEntry)

        localStorage.setItem('entries',JSON.stringify(entries))
        location.reload()

    })
}
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const { MongoClient } = require("mongodb");
const { resolve } = require('node:path');
const url = "mongodb+srv://bulumkodev:Moneytalks@autorecon.tzoujmx.mongodb.net/"
const client = new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true })
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static("frontend"))

client.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }else{
        console.log("Connected to the database successfully!")
    }
});

app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/home', (req, res)=>{
    res.render('home', {title:'AutoRecon'})
})
app.get('/register', (req, res)=>{
    res.render('register',{title:'Register on AutoRecon'})
})
app.get('/login', (req, res)=>{
    res.render('login', {title:'Login to AutoRecon'})
})
app.get('/about', (req, res)=>{
    res.render('about', {title : 'AutoRecon about page'})
})
app.get('/error', (req, res)=>{
    res.render('error',{title : 'AutoRecon Error'})
})
app.post('/register', async (req, res)=>{
    const { name, email, password} = req.body
    try {
        const myDatabase = await client.db('Autorecon')
        const userTable =  await myDatabase.collection('users')
        await userTable.insertOne({username : name, email : email, password:password})        
    } catch (error) {
        console.log(error)
    }
    res.redirect('/login')
})
app.post('/login', async (req, res)=>{
    const { email, password} = req.body
    try {
        const myDatabase =  client.db('Autorecon')
        const userTable =  myDatabase.collection('users')
        const user = await userTable.findOne({email : email})
        if(user){
            if(user.password === password){
            res.redirect('/home')
        } else{
            res.redirect('/login')
        }
        }
    } catch (error) {
        res.render('error',{title : 'Something is down'})
    }
})
app.post('/results', async (req, res) => {
    const targets = req.body.targets
    const results = {}
    if (targets) {
        const targetNamesArray = targets.split('\n').map(domain => domain.trim()).filter(one => one!=='')
        for(domain of targetNamesArray){
            const subObj = {}
            results[domain] = subObj
            subObj["target"] = domain
            subObj['subdomains'] = await vt(domain)
        }
        const a = []
        for(let i = 0; i < targetNamesArray.length;i++){
            
            const single = results[targetNamesArray[i]]
            for( d of single['subdomains']){    
                try {

                    if( ((await getDns(d)).toString() == 'undefined') || ((await getDns(d)).toString() =='Error with '+d)){
                        console.log('')
                    }
                    else{
                        const obj = {}
                        obj['name']= d
                        obj['ip'] = await getDns(d)
                        a.push(obj)
                    }
                    
                } catch (error) {
                    
                }
                
            }
        }
        
        res.render('results', {resultArr : a,title : 'AutoRecon Results'})
    }
    else{res.json({})}

});

app.listen(3000)

const vt = async (domain)=>{

    try{
        apikey = "005df6a2bab5ddd46edaa3452b52f06680eaed2b7d8dc7f14b5e3b656c0c5b4b"
        const vturl = `https://www.virustotal.com/api/v3/domains/${domain}/subdomains?limit=100`
        const options = {
            method: 'GET',
            headers: {"X-Apikey":apikey}
        };
        const vtresults = await fetch(vturl, options)
        const vtdata = await vtresults.json()
        const vtSubdomains = vtdata.data.map(el => el.id)
        return vtSubdomains
    }catch(error){
        console.log("There was an issue with Virustotal")
    }
}

const crtsh = async (domain)=>{
    try{
        const opt = {
            method:"GET"
        }
        const crtshsearch = await fetch(`https://crt.sh/?q=${domain}&output=json`,opt)
        const crtshresults = await crtshsearch.json()
        const crtshdata = crtshresults["common_name"]
        
    }catch(error){
        console.log("There was an issue with Crtsh")

    }
}
async function getDns(sub){
    try {
        const res = await resolver.resolve(sub,'A')
        return res
    } catch (error) {
        
    }
}
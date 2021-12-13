/*
12.12.2021
Jami Seilonen 
App name: Etäohjattava pesukone
Description: Lähtötasotehtävä Bittiumille
*/

const express = require('express');              //expressin avulla voidaan käyttää HTTP requestejä.
const app = express();

let idle = new Boolean(true);
let curState = 'Idle';

function idleState() {
    idle = true;        
    curState = 'Idle';                           //curState on pesuohjelman vaiheen nimi.
    console.log('Idle state');
    return curState;
}

function step(phaseName) {                       //Step funktio luo pesukoneen vaiheet promisien avulla.
    curState = phaseName;                           
    return new Promise((resolve,reject)=>{       
    if(idle == false){                           //Jos promise toteutuu pesukoneen tila siirtyy seuraavaan vaiheeseen.  
        console.log(phaseName);
        setTimeout(() => {
        resolve('Going forward');               
        },5*1000);
    }
    else{                                        //jos promise ei todeudu, tiedetään että käyttäjä on asettanut idlen tilan päälle eli pysäyttänyt koneen toiminnan.
        reject('Going idle');
        }
    });
}

//pesukoneen pyöritys    
async function runMachine(){   
    idle = false;                                //Asetetaan idle tila falseksi että suoritus voidaan aloittaa.
    try{                                         //awaitin avulla kone odottaa että stepin^ promise on täyttynyt ennen seuraavaan vaiheeseen siirtymistä.
        await step('Filling Water');
        await step('Rinsing');
        await step('Spinning');
        idleState(); 
    }
    catch(err){
        console.log('Stopped by user');          //promisen toteutumatta jääminen asettaa koneen idle -tilaan.
        idleState();
    }
}   

//Komennot pesukoneen ohjaukseen
    app.post('/api/start',(req,res) => {          //Start komennolla kysytään onko kone idle tilassa. Jos on niin sallitaan koneen käynnistys. 
        if(idle==true){                                                          
        res.status(200).json({message: 'Washing machine started'});
        runMachine();
        }                                          //Jos kone on käynnissä komento hylätään ja annetaan virheilmoitus.
        else{                                         
            res.status(400).json({message:'Can not start while running'});
        }
    });
    
    app.post('/api/status',(req,res) => {            //status komento palauttaa koneen pesuvaiheen nimen.
        res.status(200).json({message: curState});
    });

    app.post('/api/abort',(req,res) => {            //abort komento muuttaa pesukoneen tilan idleksi.
        res.status(200).json({message: 'Stopped by user'});
        return idle = true;
    });

    //aloitaa idle -tilasta.
    idleState();
    
    //Kuunnellaan porttia 3000.
    app.listen(3000);

    module.exports.app = app;
    module.exports.funcs = {
        idleState: idleState,
        step: step
    }
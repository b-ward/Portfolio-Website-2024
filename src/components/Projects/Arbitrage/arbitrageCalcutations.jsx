//Need to:
//Clean up code
//Make output text more readable
//Help and Creation

async function getArbitrageBets() {
    var sports = await getSportsNames();
    var odds = await getOdds(sports);
    return odds
}

async function getSportsNames() {
    //There is no limit request on the sports endpoint so we can use the same API key every time
    var sportsRequest = new Request('https://api.the-odds-api.com/v3/sports/?apiKey=f039cbd515b8e6e21ac8130decb39023');
    let response = await fetch(sportsRequest);
    let sportsNameData = await response.text();
    sportsNameData = JSON.parse(sportsNameData)
    var sports = [];
    var sport;
    for (sport of sportsNameData['data']) {
        sports.push(sport['key'])
    }
    return(sports)
}

async function getOdds(sports) {
    var output=""
    var stake=100
    var margin = 0;
    var sport;
    var validApiKey;
    var apiKey;
    var apiKeyList = [
        "697ebd06526cf79c2ed9defdbd248d16",
        "a6974ab74034b4611ec8d37d1cb8db37",
        "f039cbd515b8e6e21ac8130decb39023",
        "7e458c2f18d77cc342b8c4f1b18937eb",
        "ad0ffe9b1595cc5e7a70acb3ed485a23",
        "61d155851e9f5dad6251c7b6df8e741a",
        "d417071c8b31608a7221536cfd6d9c39",
        "94a35ec9f4fac82d0085331d2ef827b1",
        "93be55151e4a1fa66ac224b319dc1981",
        "159c7f9bf8416374fd316ade88b8eaed"
    ]
    //Get Valid API Key
    for (apiKey of apiKeyList) {
        var sportsRequest = new Request('https://api.the-odds-api.com/v3/odds/?apiKey='.concat(apiKey,'&sport=',sports[0],'&region=au&mkt=h2h'));
        let response = await fetch(sportsRequest);
        if (response['status']===200){
            validApiKey = apiKey
        }
    }

    for (sport of sports){
        sportsRequest = new Request('https://api.the-odds-api.com/v3/odds/?apiKey='.concat(validApiKey,'&sport=',sport,'&region=au&mkt=h2h'));
        let response = await fetch(sportsRequest);
        let oddsData = await response.text();
        oddsData = JSON.parse(oddsData)
        setTimeout(function(){ }, 1000);
        console.log(oddsData)
        if (response.status === 400){
            output = 'Need new API Key'
            break
        }
        var match
        for (match=0; match < oddsData['data'].length; match++){
            var sites = oddsData['data'][match]['sites'];
            if (sites.length > 0){
                var layBets=[]
                var h2hSites = sites[0]['odds']['h2h'];
                if (h2hSites.length === 2){
                    var highestOddsSite=['','']
                    var highestOdds=[0,0]
                    var bets=[0,0]
                    var site;
                    for (site=0; site < sites.length; site++){
                        if (sites[site]['odds']['h2h'].length !== 2){
                            //Do this so this result doesn't get printed
                            margin = 1000
                            highestOdds = [1,1]
                            break
                        }
                        //Get Lay Bets
                        if (sites[site]['site_key'] === 'betfair'){
                            layBets = sites[site]['odds']['h2h_lay']
                        }
                        //Get highest odds
                        if (sites[site]['odds']['h2h'][0] > highestOdds[0]){
                            highestOdds[0] = sites[site]['odds']['h2h'][0]
                            highestOddsSite[0] = sites[site]['site_nice']
                        }
                        if (sites[site]['odds']['h2h'][1] > highestOdds[1]){
                            highestOdds[1] = sites[site]['odds']['h2h'][1]
                            highestOddsSite[1] = sites[site]['site_nice']
                        }
                    }
                    margin = (((1/highestOdds[0])+(1/highestOdds[1]))*100)
                    bets[0]=((stake*((1/highestOdds[0])*100))/margin)
                    bets[1]=((stake*((1/highestOdds[1])*100))/margin)
                    if (layBets){
                        var site2;
                        for (site2=0; site2 < sites.length; site2++){
                            if (sites[site2]['odds']['h2h'][0] > layBets[0]){
                                output = output.concat('\n','Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                                output = output.concat('\n',oddsData['data'][match]['teams'])
                                output = output.concat('\n','Betting Site: ',sites[site2]['site_nice'])
                                output = output.concat('\n','Bet On: ',oddsData['data'][match]['teams'][0])
                                output = output.concat('\n','Bet: ',sites[site2]['odds']['h2h'][0],' Lay: ',layBets[0].toString()) 
                                output = output.concat('\n','Difference: ',(sites[site2]['odds']['h2h'][0] - layBets[0]))
                                output = output.concat('\n','----------------')
                            }
                            if (sites[site2]['odds']['h2h'][1] > layBets[1]){
                                output = output.concat('\n','Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                                output = output.concat('\n',oddsData['data'][match]['teams'])
                                output = output.concat('\n','Betting Site: ',sites[site2]['site_nice'])
                                output = output.concat('\n','Bet On: ',oddsData['data'][match]['teams'][1])
                                output = output.concat('\n','Bet: ',sites[site2]['odds']['h2h'][1],' Lay: ',layBets[1].toString()) 
                                output = output.concat('\n','Difference: ',(sites[site2]['odds']['h2h'][1] - layBets[1]))
                                output = output.concat('\n','----------------')
                            }
                        }
                    }
                }
                if (oddsData['data'][match]['sites'][0]['odds']['h2h'].length === 3){
                    highestOddsSite=['','','']
                    highestOdds=[0,0,0]
                    bets=[0,0,0]
                    for (site=0; site < oddsData['data'][match]['sites'].length; site++){
                        //Get lay bets
                        if (sites[site]['site_key'] === 'betfair'){
                            layBets = sites[site]['odds']['h2h_lay']
                        }
                        if (sites[site]['odds']['h2h'].length !== 3){
                            //Do this so this result doesn't get printed
                            margin = 1000
                            highestOdds = [1,1,1]
                            break
                        }
                        //Get Highest odds
                        if (sites[site]['odds']['h2h'][0] > highestOdds[0]){
                            highestOdds[0] = sites[site]['odds']['h2h'][0]
                            highestOddsSite[0] = sites[site]['site_nice']
                        }
                        if (sites[site]['odds']['h2h'][1] > highestOdds[1]){
                            highestOdds[1] = sites[site]['odds']['h2h'][1]
                            highestOddsSite[1] = sites[site]['site_nice']
                        }
                        if (sites[site]['odds']['h2h'][2] > highestOdds[2]){
                            highestOdds[2] = sites[site]['odds']['h2h'][2]
                            highestOddsSite[2] = sites[site]['site_nice']
                        }
                    }
                    margin = (((1/highestOdds[0])+(1/highestOdds[1])+(1/highestOdds[2]))*100)
                    bets[0]=((stake*((1/highestOdds[0])*100))/margin)
                    bets[1]=((stake*((1/highestOdds[1])*100))/margin)
                    bets[2]=((stake*((1/highestOdds[2])*100))/margin)
                    //This happens when there are three odds results and 2 lay odds. Should we include a fake number ie. 999 so we can use the two lay odds given
                    if (layBets && layBets.length === 3){
                        for (site=0; site < oddsData['data'][match]['sites'].length; site++){
                            if (sites[site]['odds']['h2h'].length !== 3){
                                break
                            }
                            if (sites[site]['odds']['h2h'][0] > layBets[0]){
                                output = output.concat('\n' , 'Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                                output = output.concat('\n' , oddsData['data'][match]['teams'])
                                output = output.concat('\n' , 'Betting Site: ',sites[site]['site_nice'])
                                output = output.concat('\n' , 'Bet On: ',oddsData['data'][match]['teams'][0])
                                output = output.concat('\n' , 'Bet: ' , sites[site]['odds']['h2h'][0] , ' Lay: ' , layBets[0].toString()) 
                                output = output.concat('\n' , 'Difference: ' , sites[site]['odds']['h2h'][0] - layBets[0].toString()) 
                                output = output.concat('\n' , '----------------')
                            }
                            if (sites[site]['odds']['h2h'][1] > layBets[1]){
                                output = output.concat('\n' , 'Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                                output = output.concat('\n' , oddsData['data'][match]['teams'])
                                output = output.concat('\n' , 'Betting Site: ',sites[site]['site_nice'])
                                output = output.concat('\n' , 'Bet On: ',oddsData['data'][match]['teams'][1])
                                output = output.concat('\n' , 'Bet: ' , sites[site]['odds']['h2h'][1] , ' Lay: ' , layBets[1].toString()) 
                                output = output.concat('\n' , 'Difference: ' , sites[site]['odds']['h2h'][1] - layBets[1].toString()) 
                                output = output.concat('\n' , '----------------')
                            }
                            if (sites[site]['odds']['h2h'][2] > layBets[2]){
                                output = output.concat('\n' , 'Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                                output = output.concat('\n' , oddsData['data'][match]['teams'])
                                output = output.concat('\n' , 'Betting Site: ',sites[site]['site_nice'])
                                output = output.concat('\n' , 'Bet On: ','Draw')
                                output = output.concat('\n' , 'Bet: ' , sites[site]['odds']['h2h'][2] , ' Lay: ' , layBets[2].toString()) 
                                output = output.concat('\n' , 'Difference: ' , sites[site]['odds']['h2h'][2] - layBets[2].toString()) 
                                output = output.concat('\n' , '----------------')
                            }
                        }
                    }
                }
                if (margin < 100){
                    output = output.concat('\n' , 'Game Time: ',new Date(oddsData['data'][match]['commence_time']*1000))
                    output = output.concat('\n' , oddsData['data'][match]['teams'])
                    output = output.concat('\n' , highestOddsSite)
                    output = output.concat('\n' , highestOdds)
                    output = output.concat('\n' , 'Margin: ' , margin)
                    output = output.concat('\n' , 'Bets: ' , bets)
                    if (oddsData['data'][match]['sites'][0]['odds']['h2h'].length === 2){
                        output = output.concat('\n' , "Winnings: " , (bets[0]*highestOdds[0])-(bets[1]+bets[0]))
                    }
                    if (oddsData['data'][match]['sites'][0]['odds']['h2h'].length === 3){
                        output = output.concat('\n' , "Winnings: " , (bets[0]*highestOdds[0])-(bets[1]+bets[2]+bets[0]))
                    }
                    output = output.concat('\n' , '----------------')
                }
            }
        }
    }
    console.log(output)
    return output;
}

export default getArbitrageBets;
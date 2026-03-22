async function getArbitrageBets() {
    const sports = await getSportsNames()
    const results = await getOdds(sports)
    return results
}

async function getSportsNames() {
    // v4 sports endpoint — returns an array directly, no .data wrapper
    const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/?apiKey=f039cbd515b8e6e21ac8130decb39023`
    )
    const data = await response.json()
    return data.filter((s) => s.active).map((s) => s.key)
}

async function getOdds(sports) {
    const stake = 100
    const apiKeyList = [
        '697ebd06526cf79c2ed9defdbd248d16',
        'a6974ab74034b4611ec8d37d1cb8db37',
        'f039cbd515b8e6e21ac8130decb39023',
        '7e458c2f18d77cc342b8c4f1b18937eb',
        'ad0ffe9b1595cc5e7a70acb3ed485a23',
        '61d155851e9f5dad6251c7b6df8e741a',
        'd417071c8b31608a7221536cfd6d9c39',
        '94a35ec9f4fac82d0085331d2ef827b1',
        '93be55151e4a1fa66ac224b319dc1981',
        '159c7f9bf8416374fd316ade88b8eaed',
    ]

    // Find a valid API key using v4 endpoint
    let validApiKey = null
    for (const apiKey of apiKeyList) {
        const testResponse = await fetch(
            `https://api.the-odds-api.com/v4/sports/${sports[0]}/odds/?apiKey=${apiKey}&regions=au&markets=h2h&oddsFormat=decimal`
        )
        if (testResponse.status === 200) {
            validApiKey = apiKey
            break
        }
    }

    if (!validApiKey) {
        throw new Error('All API keys exhausted. Please try again later.')
    }

    const arbitrageBets = []
    const layBets = []

    for (const sport of sports) {
        // Fetch h2h and h2h_lay in one request to save quota
        const response = await fetch(
            `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${validApiKey}&regions=au&markets=h2h,h2h_lay&oddsFormat=decimal`
        )

        if (!response.ok) break

        // v4 returns an array directly — no .data wrapper
        const matches = await response.json()
        if (!Array.isArray(matches)) break

        for (const match of matches) {
            const bookmakers = match.bookmakers
            if (!bookmakers || bookmakers.length === 0) continue

            const teams = [match.home_team, match.away_team]
            const gameTime = new Date(match.commence_time)

            let highestOdds = []
            let highestOddsSite = []
            let outcomeNames = []
            let matchLayOdds = null

            for (const bookmaker of bookmakers) {
                const h2hMarket = bookmaker.markets?.find((m) => m.key === 'h2h')
                const layMarket = bookmaker.markets?.find((m) => m.key === 'h2h_lay')

                if (h2hMarket) {
                    const outcomes = h2hMarket.outcomes
                    if (outcomes.length < 2 || outcomes.length > 3) continue

                    // Initialise on first valid bookmaker
                    if (highestOdds.length === 0) {
                        highestOdds = Array(outcomes.length).fill(0)
                        highestOddsSite = Array(outcomes.length).fill('')
                        outcomeNames = outcomes.map((o) => o.name)
                    }

                    if (outcomes.length !== highestOdds.length) continue

                    for (let i = 0; i < outcomes.length; i++) {
                        if (outcomes[i].price > highestOdds[i]) {
                            highestOdds[i] = outcomes[i].price
                            highestOddsSite[i] = bookmaker.title
                        }
                    }
                }

                // Betfair lay market (key is betfair_ex_au in AU region)
                if (layMarket && bookmaker.key.includes('betfair')) {
                    matchLayOdds = layMarket.outcomes.map((o) => o.price)
                }
            }

            if (highestOdds.length === 0) continue

            const outcomeCount = highestOdds.length
            const margin = highestOdds.reduce((sum, odd) => sum + (1 / odd) * 100, 0)
            const bets = highestOdds.map((odd) => (stake * ((1 / odd) * 100)) / margin)

            // Lay bet opportunities
            if (matchLayOdds && matchLayOdds.length === outcomeCount) {
                for (const bookmaker of bookmakers) {
                    const h2hMarket = bookmaker.markets?.find((m) => m.key === 'h2h')
                    if (!h2hMarket || h2hMarket.outcomes.length !== outcomeCount) continue

                    for (let i = 0; i < outcomeCount; i++) {
                        const backPrice = h2hMarket.outcomes[i].price
                        if (backPrice > matchLayOdds[i]) {
                            layBets.push({
                                gameTime,
                                teams,
                                bettingSite: bookmaker.title,
                                betOn: outcomeNames[i] || teams[i] || 'Draw',
                                bet: backPrice,
                                lay: matchLayOdds[i],
                                difference: +(backPrice - matchLayOdds[i]).toFixed(3),
                            })
                        }
                    }
                }
            }

            // Arbitrage opportunity
            if (margin < 100) {
                const winnings =
                    outcomeCount === 2
                        ? bets[0] * highestOdds[0] - (bets[0] + bets[1])
                        : bets[0] * highestOdds[0] - (bets[0] + bets[1] + bets[2])

                arbitrageBets.push({
                    gameTime,
                    teams,
                    sites: highestOddsSite,
                    odds: highestOdds.map((o) => +o.toFixed(3)),
                    margin: +margin.toFixed(3),
                    bets: bets.map((b) => +b.toFixed(2)),
                    winnings: +winnings.toFixed(2),
                    outcomeCount,
                    outcomeNames,
                })
            }
        }
    }

    return { arbitrageBets, layBets }
}

export default getArbitrageBets
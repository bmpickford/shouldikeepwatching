import { ResponsiveHeatMapCanvas, HeatMapDatum } from '@nivo/heatmap'
import { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

interface IShow {
    seasons: ISeason[];
}

interface ISeason {
    season: number;
    episodes: IEpisode[];
}

interface IEpisode {
    episode_number: number;
    vote_average: number;
}

export const MyResponsiveHeatMap = ({ imdbID }: any) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [heatmapData, setHeatmapData] = useState([] as HeatMapDatum[]);
    const [maxEpisodes, setMaxEpisodes] = useState(0);

    const transformDataToHeatmap = (data: IShow): HeatMapDatum[] => {
        const numEpisodesForEachSeason = data.seasons.map((val) => val.episodes.length);
        const maxEpisodes = numEpisodesForEachSeason.sort((a, b) => b - a)[0];

        const heatmapData = data.seasons.map((season) => {
            const seasonInfo = {
                season: season.season,
            } as HeatMapDatum;
            for(let i = 0; i < maxEpisodes; i++) {
                const episode = season.episodes.find((e) => e.episode_number === (i + 1));
                if (!episode) {
                    console.warn(`No rating in data for season ${season.season}, episode ${i}`);
                    seasonInfo[(i + 1).toString()] = -1;
                } else {
                    seasonInfo[episode.episode_number.toString()] = !isNaN(episode.vote_average) ? episode.vote_average : -1;
                }
            }
            return seasonInfo;
        });
        return heatmapData;
    }

    const getSeasonData = async (id: string, season: number): Promise<ISeason> => {
        
        const response = await fetch(`/api/shows/${id}/seasons/${season}`);
        const responseData = await response.json();

        if (!response.ok || !responseData) {
            console.warn('No response data', response);
            return { episodes: [], season};
        }
        const episodes = responseData.episodes.map((e: any) => {
            return {
                episode_number: +e.episode_number,
                vote_average: +e.vote_average * 10,
            } as IEpisode;
        });
        return { episodes, season } as ISeason;
    }


    useEffect(() => {
        const getShowData = async (id: string) => {
            setIsDataLoaded(false);
            
            const response = await fetch(`/api/shows/${id}`);
            if (!response.ok) {
                console.error('Error response from API: ', response);
                return;
            }
            const body = await response.json();
            
            const totalSeasons = body.number_of_seasons as number;
            const showData = { seasons: [] as ISeason[] } as IShow;
    
            for (let season = 1; season <= totalSeasons; season++) {
                const seasonInfo = await getSeasonData(id, season);
                showData.seasons.push(seasonInfo);
            }
    
            const numEpisodesForEachSeason = showData.seasons.map((val) => val.episodes.length);
            const maxEpisodes = numEpisodesForEachSeason.sort((a, b) => b - a)[0];

            setMaxEpisodes(maxEpisodes);
            setHeatmapData(transformDataToHeatmap(showData));
            setIsDataLoaded(true);
        }
        getShowData(imdbID)
    }, [imdbID]);

    if (imdbID !== null && !isDataLoaded) {
        return (
            <div style={{textAlign: 'center', marginTop: '50pt'}}>
                <Loader
                    type='Rings'
                    color='#00BFFF'
                    height={100}
                    width={100} />
            </div>
        );
    }

    if (isDataLoaded) {
        return (
            <div style={{height: '90vh', textAlign: 'center'}}>
            <ResponsiveHeatMapCanvas
                data={heatmapData}
                //@ts-ignore
                keys={new Array(maxEpisodes).fill(0).map((_, i) => (i + 1).toString())}
                cellShape={'circle'}
                colors={'RdYlGn'}
                indexBy="season"
                margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
                forceSquare={true}
                axisTop={{
                    orient: 'top',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -90,
                    legend: 'Episode',
                    legendPosition: 'middle',
                    legendOffset: -36
                }}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Season',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                cellOpacity={1}
                cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
                //@ts-ignore
                defs={[
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(0, 0, 0, 0.1)',
                        rotation: -45,
                        lineWidth: 4,
                        spacing: 7
                    }
                ]}
                fill={[{ id: 'lines' }]}
                animate={false}
                // motionConfig="wobbly"
                // motionStiffness={80}
                // motionDamping={9}
                // hoverTarget="cell"
                cellHoverOthersOpacity={0.25}
                isInteractive={false}
                theme={{
                    textColor: 'white'
                }}
            />
            </div>
        );
    }
    return <></>;
    
}
export default defineEventHandler(async (event: any) => {
    setResponseHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // OPTIONSも明示的に許可
        'Access-Control-Allow-Headers': 'Content-Type',
    })

    if (event.node.req.method === 'OPTIONS') {
        setResponseStatus(event, 204) // 204 No Content
        return '' // 空のレスポンスを返して終了
    }

    const body = await readBody(event)
    console.log("body: ", body);
    
    const response = await fetch("https://asakura-wiki.vercel.app/api/youtube/playlists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({urls: body})
    })
    
    const data = await response.json();
    let videoIdArray: string[] = [];
    let videoLengthArray: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
        // オプショナルチェイニング (?.) を入れておくと、万が一YouTube側のデータ構造が変わった時に即死（500エラー）するのを防げます
        const playlistVideo = data[i]?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents?.[0]?.playlistVideoRenderer;
        
        if (playlistVideo) {
            videoIdArray.push(playlistVideo.videoId);
            videoLengthArray.push(parseInt(playlistVideo.lengthSeconds || '0') + 2);
        }
    }
    
    return {
        src: videoIdArray,
        times: videoLengthArray
    };
});

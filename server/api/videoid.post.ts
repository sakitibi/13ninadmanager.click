export default defineEventHandler(async (event: any) => {
    const body = await readBody(event)

    const response = await fetch("https://asakura-wiki.vercel.app/api/youtube/playlists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({urls: body})
    })
    const data = await response.json();
    let videoIdArray = [];
    for (let i = 0;i < data.length;i++) {
        videoIdArray.push(
            data[i].contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents[0].playlistVideoRenderer.videoId
        );
    }
    return videoIdArray;
})
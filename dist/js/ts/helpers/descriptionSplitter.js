function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }
    chunks[0] += '-';
    return chunks;
}
export function descriptionSplitter(desc) {
    const words = desc.split(' ');
    const out = [];
    for (const word of words) {
        if (word.length > 13) {
            chunkSubstr(word, 13).forEach(x => out.push(x));
        }
        else
            out.push(word);
    }
    return out.join(' ');
}

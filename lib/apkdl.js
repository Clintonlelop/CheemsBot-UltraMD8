const axios = require('axios');

/**
 * Searches for APKs on Aptoide
 * @param {string} query 
 * @param {number} limit 
 */
async function searchApk(query, limit = 10) {
    if (!query) throw new Error('Search query is required');
    const url = `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await axios.get(url, { timeout: 15000 });
    const list = res.data?.datalist?.list || [];
    
    return list.map((item, index) => {
        const sizeBytes = item.file?.filesize || item.size || 0;
        const sizeFormatted = sizeBytes ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : 'N/A';
        return {
            index: index + 1,
            id: item.id,
            name: item.name || 'Unknown App',
            package: item.package,
            version: item.file?.vername || item.version?.name || 'Latest',
            vercode: item.file?.vercode,
            sizeBytes,
            sizeFormatted,
            icon: item.icon || item.graphic,
            downloadUrl: item.file?.path,
            updated: item.updated || item.modified || item.file?.added || 'Recently'
        };
    });
}

/**
 * Gets specific APK details and direct download URL
 * @param {string|number} appIdOrPackage 
 */
async function getApkDetails(appIdOrPackage) {
    if (!appIdOrPackage) throw new Error('App ID or Package name is required');
    
    let url;
    if (/^\d+$/.test(String(appIdOrPackage).trim())) {
        url = `https://ws75.aptoide.com/api/7/app/get/app_id=${String(appIdOrPackage).trim()}`;
    } else {
        url = `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(String(appIdOrPackage).trim())}&limit=1`;
    }

    const res = await axios.get(url, { timeout: 15000 });
    
    let data;
    if (res.data?.nodes?.meta?.data) {
        data = res.data.nodes.meta.data;
    } else if (res.data?.datalist?.list?.[0]) {
        data = res.data.datalist.list[0];
    } else {
        throw new Error('App not found or download link unavailable');
    }

    const file = data.file || {};
    const sizeBytes = file.filesize || data.size || 0;
    const sizeFormatted = sizeBytes ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : 'N/A';

    return {
        id: data.id,
        name: data.name,
        package: data.package,
        version: file.vername || data.version?.name || 'Latest',
        vercode: file.vercode,
        sizeBytes,
        sizeFormatted,
        icon: data.icon || data.media?.icon || data.graphic,
        downloadUrl: file.path || file.path_alt,
        updated: data.updated || file.added || 'Recently',
        description: data.media?.description || data.description || '',
        md5: file.md5sum || ''
    };
}

/**
 * Downloads APK buffer directly
 * @param {string} downloadUrl 
 * @param {number} maxBytes Limit in bytes (default 100MB)
 */
async function getApkBuffer(downloadUrl, maxBytes = 95 * 1024 * 1024) {
    if (!downloadUrl) throw new Error('Download URL is required');
    const res = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*'
        },
        maxContentLength: maxBytes,
        timeout: 60000
    });
    return Buffer.from(res.data);
}

/**
 * Gets earlier / historical versions of an application
 * @param {string|number} queryOrPackage 
 * @param {number} limit 
 */
async function getApkVersions(queryOrPackage, limit = 15) {
    if (!queryOrPackage) throw new Error('Package name or App name is required');
    let pkg = String(queryOrPackage).trim();
    let appTitle = pkg;

    // If query is not a package name (doesn't contain dot or is numeric ID)
    if (/^\d+$/.test(pkg)) {
        const details = await getApkDetails(pkg);
        pkg = details.package;
        appTitle = details.name;
    } else if (!pkg.includes('.')) {
        const searchResults = await searchApk(pkg, 1);
        if (searchResults.length > 0) {
            pkg = searchResults[0].package;
            appTitle = searchResults[0].name;
        }
    }

    const url = `https://ws75.aptoide.com/api/7/apps/get/package_name=${encodeURIComponent(pkg)}/versions`;
    const res = await axios.get(url, { timeout: 15000 });
    const list = res.data?.datalist?.list || [];

    const versions = list.slice(0, limit).map((v, idx) => {
        const file = v.file || {};
        const sizeBytes = file.filesize || v.size || 0;
        const sizeFormatted = sizeBytes ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : 'N/A';
        const date = v.updated || v.modified || v.added || 'N/A';
        const year = date && date !== 'N/A' ? date.split('-')[0] : '';
        
        return {
            index: idx + 1,
            id: v.id,
            name: appTitle || v.name || pkg,
            package: pkg,
            version: file.vername || v.version?.name || (file.vercode ? `v${file.vercode}` : `v${idx + 1}`),
            vercode: file.vercode,
            sizeBytes,
            sizeFormatted,
            date: date.split(' ')[0],
            year,
            icon: v.icon
        };
    });

    return {
        appName: appTitle,
        package: pkg,
        versions
    };
}

module.exports = {
    searchApk,
    getApkDetails,
    getApkVersions,
    getApkBuffer
};

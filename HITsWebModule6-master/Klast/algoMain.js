let points = [];

function generateKCenters(centersCount){
    let centers = [];
    for(let i = 0; i < centersCount; ++i){
        centers.push(randomPoint());
        centers[i].color = colors[i];
    }
    
    return centers;
}

function clustWithoutKStep(centers){
    let clusters = createClusters(centers);
    let WPrev;
    let numOfW = allocatePoints(clusters, totalDist);
    while(numOfW != WPrev){
        WPrev = numOfW;
        calculateCenters(clusters);
        numOfW = allocatePoints(clusters, totalDist);
    }

    return numOfW;
}

function createClusters(centers){
    let clusters = [];

    centers.forEach( center => {
        const cluster = {
            center:center,
            points:[],
        };
        clusters.push(cluster);
    });

    return clusters;
}

function allocatePoints(clusters,findDist){
    let numOfW = 0;
    clusters.forEach(cluster => cluster.points = []);

    points.forEach(p =>{
        numOfW += findBestCluster(p, clusters, findDist);
    });

    return numOfW;
}

function findBestCluster(point, clusters,findDist){
    let minDist, minCluster;
    clusters.forEach(cluster => {
        let dist = findDist(point, cluster.center);
        if (dist < minDist || minDist == null){
            minDist = dist;
            minCluster = cluster;
        }
    });

    minCluster.points.push(point);
    point.color = minCluster.center.color;

    // return Math.pow(minDist, 2);
    return minDist;
}



function clustWithoutK(){
    let ChoseW = [clustWithK(1)];
    let MaxCount = 12;
    let maxAttitude, clustersCount;

    for (let i = 2; i < MaxCount; ++i){
        ChoseW.push(clustWithK(i));
        let Attitude = ChoseW[i-2] / ChoseW[i-1];
        if (Attitude > maxAttitude || maxAttitude == null){
            maxAttitude = Attitude;
            clustersCount = i;
        }
    }

    clustWithK(clustersCount);
}


function clustWithK(clustersCount) {
    let centers = generateKCenters(clustersCount),minCenters = centers;
    let numOfW = clustWithoutKStep(centers),WMin = numOfW;
    for(let i = 0; i < 50; ++i){
        centers = generateKCenters(clustersCount);
        numOfW = clustWithoutKStep(centers);
        if(numOfW < WMin){
            WMin = numOfW;
            minCenters = centers;
        }
    }
    clustWithoutKStep(minCenters);
    
    return WMin;
}

function calculateCenters(clusters){
    clusters.forEach(cluster => {
        cluster.center = calculateNewCenter(cluster);
    });
}

function calculateNewCenter(cluster){
    if(cluster.points.length == 0){
        return cluster.center;
    }

    let sumX = 0, sumY = 0;
    cluster.points.forEach(p => {
        sumX += p.x;
        sumY += p.y;
    });

    return new Point(sumX / cluster.points.length,
                     sumY / cluster.points.length,
                     cluster.center.color);
}


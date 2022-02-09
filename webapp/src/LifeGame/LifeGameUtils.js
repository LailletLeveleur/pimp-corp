function neighborsCount(m, x, y, X, Y) {
    let count =
        getCellValue(m, x - 1, y - 1,       X,      Y) +
        getCellValue(m, x - 1, y    ,       X,      Y) +
        getCellValue(m, x - 1, y + 1,       X,      Y) +
        getCellValue(m, x    , y - 1,       X,      Y) +
        getCellValue(m, x    , y + 1,       X,      Y) +
        getCellValue(m, x + 1, y - 1,       X,      Y) +
        getCellValue(m, x + 1, y    ,       X,      Y) +
        getCellValue(m, x + 1, y + 1,       X,      Y);

    return count;
}
function getCellValue(m, x, y, X, Y) {
    if (x < 0 || x > X - 1 || y < 0 || y > Y - 1) {
        return 0;
    } else {
        const result = m[x][y];
        return result;
    }
}

export default {neighborsCount, getCellValue}
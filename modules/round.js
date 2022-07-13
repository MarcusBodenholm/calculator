const round = (nr) => Math.round((nr + Number.EPSILON) * 100) / 100;

export default round;
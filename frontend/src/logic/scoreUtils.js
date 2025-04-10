export default function getScoreForLines(ligne) {
	switch (ligne) {
		case 1:
			return 100;
		case 2:
			return 300;
		case 3:
			return 500;
		case 4:
			return 800;
		default:
			return 0;
	}
}
export default function cubic(a, b, c, d) {
	if (a < 0 || a > 1 || c < 0 || c > 1) {
		return linear;
	}
	return (x) => {
		if (x <= 0) {
			let start_gradient = 0;
			if (a > 0)
				start_gradient = b / a;
			else if (!b && c > 0)
				start_gradient = d / c;
			return start_gradient * x;
		}
		if (x >= 1) {
			let end_gradient = 0;
			if (c < 1)
				end_gradient = (d - 1) / (c - 1);
			else if (c == 1 && a < 1)
				end_gradient = (b - 1) / (a - 1);
			return 1 + end_gradient * (x - 1);
		}

		let start = 0, end = 1;
		while (start < end) {
			let mid = (start + end) / 2;
			let f = (a, b, m) => { return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;};
			let xEst = f(a, c, mid);
			if (Math.abs(x - xEst) < 0.00001) {
				return f(b, d, mid);
			}
			if (xEst < x) {
				start = mid;
			} else {
				end = mid;
			}
		}
		return f(b, d, mid);
	};
}
const bookLoanCheck = async (req, res, next) => {
	try {
		const { isbn, libraryId } = req.query; // params에서 isbn과 libraryId를 받아옴
		const getLoanResultFunc = require(`../../middlewares/loanCheck/loan${libraryId}`); // 각 도서관 libraryId 별로 함수를 따로 구현하였고, middlewares안에 내장되어있음
		const loanResult = await getLoanResultFunc(isbn).catch(e => next(e)); // 함수내 isbn을 활용하여 대출 결과를 받아옴
		return res.json(loanResult);
	} catch (e) {
		next(e);
	}
};

export { bookLoanCheck };

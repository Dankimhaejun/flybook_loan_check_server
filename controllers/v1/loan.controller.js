import axios from 'axios';

const bookLoanCheck = async (req, res, next) => {
	const loanResult = {
		isHold: false, // 책 소지 유무
		isLoan: false, // 대출 가능 유무
		callNumber: '', // 청구기호
		location: '', // 위치
	};
	try {
		const { isbn, libraryId } = req.query;
		if (libraryId === '35' || libraryId === 35) {
			const result35 = await axios(
				`${process.env.THIRTY_FIVE}/booksearch?pageno=1&display=10&search_type=detail&manage_code=MJ&search_isbn_issn=${isbn}`,
			); // 신대도서관 접속
			const result35Data = result35.data;
			if (result35Data.RESULT_INFO !== 'SUCCESS' || result35Data.LIST_DATA[0].SEARCH_COUNT === 0) {
				return res.json(loanResult); // 서버 접속이 원활하지 않거나 , 책이 없을 경우
			} else {
				for (let i = 1; i < result35Data.LIST_DATA.length; i++) {
					let bookInfo = result35Data.LIST_DATA[i];

					if (bookInfo.LOAN_CODE === 'OK') {
						loanResult.isHold = true;
						loanResult.isLoan = true;
						loanResult.callNumber = bookInfo.CALL_NO;
						loanResult.location = bookInfo.SHELF_LOC_NAME;
						return res.json(loanResult); // 대출가능한 경우
					} else {
						loanResult.isHold = true;
						loanResult.callNumber = bookInfo.CALL_NO;
						loanResult.location = bookInfo.SHELF_LOC_NAME;
						// 대출 불가한 경우
					}
				}
				return res.json({
					loanResult,
				});
			}
		}
		// if (result35Data.RESULT_INFO !== 'SUCCESS' || result35Data.LIST_DATA[0].SEARCH_COUNT === 0) {
		// 	return loanResult;
		// }
		// 책이 없거나 서칭 결과가 SUCCESS가 아니라면 책이 없다고 생각함
	} catch (e) {
		next(e);
	}
};

export { bookLoanCheck };

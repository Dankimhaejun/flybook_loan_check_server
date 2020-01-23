import axios from 'axios';

// 35, 순천 신대 도서관, http://suncheonsdlib.bookscreen.flybook.kr/

module.exports = async function(isbn) {
	const loanResult = {
		isHold: false, // 책 소지 유무
		isLoan: false, // 대출 가능 유무
		callNumber: '', // 청구기호
		location: '', // 위치
	};
	try {
		const result35 = await axios(
			`http://210.90.123.213:9070/kdotapi/ksearchapi/booksearch?pageno=1&display=10&search_type=detail&manage_code=MJ&search_isbn_issn=${isbn}`,
		).catch(err => next(err)); // 신대도서관 접속
		const result35Data = result35.data;
		if (result35Data.RESULT_INFO !== 'SUCCESS' || result35Data.LIST_DATA[0].SEARCH_COUNT === 0) {
			return loanResult; // 서버 접속이 원활하지 않거나 , 책이 없을 경우
		} else {
			for (let i = 1; i < result35Data.LIST_DATA.length; i++) {
				let bookInfo = result35Data.LIST_DATA[i];

				if (bookInfo.LOAN_CODE === 'OK') {
					loanResult.isHold = true;
					loanResult.isLoan = true;
					loanResult.callNumber = bookInfo.CALL_NO;
					loanResult.location = bookInfo.SHELF_LOC_NAME;
					return loanResult; // 대출가능한 경우
				} else {
					loanResult.isHold = true;
					loanResult.callNumber = bookInfo.CALL_NO;
					loanResult.location = bookInfo.SHELF_LOC_NAME;
					// 대출 불가한 경우
				}
			}
			return loanResult;
		}
	} catch (e) {
		next(e);
	}
};

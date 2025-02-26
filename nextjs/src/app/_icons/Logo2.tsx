import React from "react";

function Logo({ className }: { className?: string }) {
	return (
<svg className={`${className}`} width="67" height="48" viewBox="0 0 67 48" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M40.5072 8.50391H27.5027C19.0206 8.50391 12.1445 15.2725 12.1445 23.622C12.1445 31.9715 19.0206 38.7401 27.5027 38.7401H40.5072C48.9893 38.7401 55.8654 31.9715 55.8654 23.622C55.8654 15.2725 48.9893 8.50391 40.5072 8.50391Z" fill="#9223c5" />
	<path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M43.8976 15.4715C42.6095 14.4945 41.0276 14.126 39.4342 14.005C38.8736 13.9634 38.3111 13.9502 37.7601 13.954C36.3338 13.9615 34.9112 13.9615 33.4887 13.9597H33.0433C32.2888 13.9597 31.5343 13.9597 30.7799 13.9615C28.8658 13.9615 26.9538 14.2318 25.368 15.3694C24.0683 16.3011 23.0893 17.6504 22.6189 19.1754C22.4039 19.8727 22.2964 20.6003 22.2964 21.3297C22.2964 24.3212 24.2411 27.1974 27.0862 28.2066C27.2532 28.2689 27.4241 28.3219 27.5969 28.3672C28.3801 28.577 29.1884 28.6658 30.0062 28.6979L32.5844 26.6438C33.6115 27.6264 34.8459 28.3049 36.1591 28.6696C36.4739 28.6696 36.7868 28.6715 37.0997 28.6771C37.3416 28.6809 37.6219 28.7055 37.8005 28.8888C37.8216 28.9115 37.8427 28.9341 37.8619 28.9587C37.9195 29.0286 37.9675 29.1042 38.0174 29.1779C38.0884 29.2875 38.1595 29.399 38.2554 29.4897C38.7872 29.9981 39.7049 30.0132 40.2885 29.5842C40.5131 29.4179 40.6705 29.1949 40.7876 28.9436C40.8625 28.7849 40.9239 28.6715 41.0276 28.5864C41.0871 28.5373 41.1601 28.4957 41.256 28.4636L41.3463 28.4315C41.6227 28.3351 41.8972 28.2387 42.1679 28.1329C42.5845 27.9723 42.9934 27.7871 43.3774 27.5471C45.3778 26.2941 46.6775 24.102 46.8176 21.753C46.8272 21.6132 46.8311 21.4715 46.8311 21.3297C46.8311 19.0639 45.7099 16.8453 43.8996 15.4715H43.8976ZM35.8097 26.6267C35.7655 26.6211 35.7213 26.6154 35.6772 26.6078C35.3316 26.553 34.9976 26.4056 34.7269 26.1845C34.6156 26.0957 34.5292 25.9786 34.4601 25.8482C34.0473 25.5382 33.6653 25.1754 33.3236 24.7615C31.0313 21.9741 31.4691 17.8847 34.3007 15.6283C37.1324 13.3719 41.2868 13.8028 43.579 16.5902C45.8712 19.3776 45.4335 23.4652 42.6018 25.7234C40.6225 27.3014 37.9944 27.566 35.8097 26.6267Z"
		fill="white"
	/>
	<path d="M37.7771 32.5928C38.065 32.589 38.353 32.4851 38.5431 32.2886C39.096 31.716 38.6179 30.7881 37.7771 30.7881C36.8095 30.7881 36.4064 31.956 37.2069 32.4454C37.3739 32.5475 37.5755 32.5966 37.7771 32.5928Z" fill="white" />
	<path d="M39.511 29.8489C39.9468 29.8016 40.3691 29.6013 40.6244 29.2801C41.3751 28.3446 40.5073 27.0369 39.2345 27.1654C37.7697 27.3109 37.3359 29.1081 38.624 29.7147C38.8928 29.8413 39.2057 29.8829 39.511 29.8489Z" fill="white" />
	<path d="M35.1223 34.4447C35.3469 34.4428 35.5696 34.3616 35.7174 34.2123C36.1475 33.7757 35.775 33.069 35.1223 33.069C34.3717 33.069 34.0588 33.9572 34.6788 34.3313C34.8094 34.4088 34.9649 34.4466 35.1223 34.4447Z" fill="white" />
	<path
		d="M45.0091 15.4489C42.1698 11.9944 37.0939 11.3708 33.4867 13.9597C33.3715 14.0429 33.2563 14.1298 33.143 14.2205C29.8391 16.853 29.0827 21.4356 31.2021 24.926C31.4056 25.2624 31.636 25.5875 31.8932 25.9012C32.1102 26.1657 32.3405 26.4133 32.5824 26.6438C33.6095 27.6265 34.8439 28.3049 36.1571 28.6697C36.7138 28.8227 37.284 28.921 37.8599 28.9588C38.9196 29.0344 39.9966 28.9116 41.0256 28.5865C41.4134 28.4656 41.7954 28.3144 42.1659 28.133C42.7227 27.8665 43.2564 27.532 43.7593 27.1314C45.5102 25.7349 46.5469 23.7903 46.8156 21.7531C47.1055 19.5761 46.5238 17.2914 45.0091 15.4489ZM42.6017 25.7235C40.6224 27.3015 37.9943 27.566 35.8096 26.6268C35.3354 26.4246 34.8823 26.1638 34.46 25.8482C34.0472 25.5383 33.6652 25.1755 33.3235 24.7616C31.0313 21.9742 31.469 17.8848 34.3006 15.6284C37.1323 13.372 41.2867 13.8029 43.5789 16.5903C45.8711 19.3777 45.4334 23.4653 42.6017 25.7235Z"
		fill="white"
	/>
	<path d="M33.2487 26.1128L32.5825 26.6438L30.0043 28.698L22.018 35.0608C21.6974 35.3178 21.2252 35.2687 20.9641 34.9512L20.5072 34.3956C20.2461 34.08 20.296 33.6151 20.6185 33.3581L27.0843 28.2066L31.2022 24.926L31.8492 24.4101C32.1698 24.1531 32.6421 24.2022 32.9031 24.5197L33.3601 25.0734C33.6211 25.3909 33.5712 25.8558 33.2487 26.1128Z" fill="white" />
	<path d="M39.6585 18.4687C39.6624 18.3288 39.6432 18.189 39.5971 18.0567C39.3686 17.3915 38.5393 17.0155 37.8866 17.2989C37.2377 17.5805 36.9209 18.4101 37.2415 19.0413C37.5295 19.6101 38.2897 19.8879 38.881 19.6403C39.3418 19.4476 39.6451 18.96 39.6566 18.4687H39.6585Z" fill="white" />
	<path d="M39.6547 22.921C39.6547 22.647 39.5741 22.3748 39.4071 22.1556C38.8964 21.481 37.7945 21.4999 37.3299 22.2104C36.9287 22.8265 37.1302 23.7052 37.7926 24.0473C38.3032 24.3118 38.9886 24.1777 39.361 23.7411C39.5549 23.5144 39.6528 23.2158 39.6528 22.9191L39.6547 22.921Z" fill="white" />
	<path d="M40.6242 21.9572C40.8527 21.9591 41.0811 21.9043 41.2789 21.7871C41.7761 21.4923 42.0218 20.8366 41.8394 20.2904C41.5707 19.493 40.5302 19.1622 39.8621 19.68C39.2842 20.1298 39.1825 21.0218 39.6912 21.5622C39.9293 21.8155 40.2787 21.9534 40.6261 21.9553L40.6242 21.9572Z" fill="white" />
	<path d="M36.1453 21.9667C36.8517 21.9667 37.4258 21.3978 37.4258 20.6949C37.4258 19.9919 36.8767 19.51 36.2086 19.4401C35.4868 19.3645 34.8667 19.99 34.8667 20.6949C34.8667 21.3997 35.4388 21.9667 36.1472 21.9667H36.1453Z" fill="white" />
</svg>
	);
}

export default Logo;
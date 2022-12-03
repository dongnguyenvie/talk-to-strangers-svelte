import { ROUTES } from '$lib/@core/constants';

export const sidebarConfig = [
	{
		name: 'Phòng chờ',
		path: ROUTES.rooms,
		icon: (color: string = '#212B36') => `
			<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="10" y="14.0099" width="4" height="7" fill="${color}"/>
				<path d="M20.4201 10.1898L12.7101 2.30984C12.5223 2.12052 12.2668 2.01404 12.0001 2.01404C11.7335 2.01404 11.4779 2.12052 11.2901 2.30984L3.58012 10.1998C3.20327 10.5797 2.99437 11.0948 3.00012 11.6298V20.0098C2.99851 21.0728 3.82872 21.9514 4.89012 22.0098H8.00012V13.0098C8.00012 12.4576 8.44783 12.0098 9.00012 12.0098H15.0001C15.5524 12.0098 16.0001 12.4576 16.0001 13.0098V22.0098H19.1101C20.1715 21.9514 21.0017 21.0728 21.0001 20.0098V11.6298C21.0009 11.0928 20.7929 10.5764 20.4201 10.1898Z" fill="${color}"/>
			</svg>
		`
	},
	{
		name: 'Bạn bè',
		path: ROUTES.friends,
		auth: true,
		icon: (color: string = '#212B36') => `
			<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 11.0099C11.2091 11.0099 13 9.21903 13 7.00989C13 4.80075 11.2091 3.00989 9 3.00989C6.79086 3.00989 5 4.80075 5 7.00989C5 9.21903 6.79086 11.0099 9 11.0099Z" fill="${color}"/>
				<path d="M17 13.0099C18.6569 13.0099 20 11.6667 20 10.0099C20 8.35303 18.6569 7.00989 17 7.00989C15.3431 7.00989 14 8.35303 14 10.0099C14 11.6667 15.3431 13.0099 17 13.0099Z" fill="${color}"/>
				<path d="M21 20.0099C21.5523 20.0099 22 19.5622 22 19.0099C21.9984 17.1032 20.9125 15.3634 19.2003 14.5244C17.4882 13.6853 15.4479 13.893 13.94 15.0599C11.9371 13.0648 8.93071 12.4704 6.31923 13.553C3.70774 14.6357 2.00382 17.1829 2 20.0099C2 20.5622 2.44772 21.0099 3 21.0099H15C15.5523 21.0099 16 20.5622 16 20.0099" fill="${color}"/>
			</svg>
		`
	}
];

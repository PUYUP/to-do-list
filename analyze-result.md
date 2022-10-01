## Frontend

1.	split each small element to own Component
2.	used `useQuery` and `useMutation` to fetch and send data to backend server
3.	used Formik combine with Yup so we can improve fied validators before send to backend server
4. 	import MUI component only from their relpath not from '@mui/material'
	use import Button from '@mui/material/Button'
	instead import { Button } from '@mui/material'


## Backend

1.	move own app schema to their app folder for scalable if we added more app
2.	added update functionality for todo
3.	added cache functionality to improve fetching speed
4. 	separated settings file (production.py, development.py)
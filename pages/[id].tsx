import TwitterLayout from '@/Components/Layout/TwitterLayout'
import type {NextPage} from 'next'

const userProfilePage: NextPage =()=>{
    return(
        <div>
            <TwitterLayout>
                <p>Profile Page</p>
            </TwitterLayout>   
        </div>
    )
}

export default userProfilePage
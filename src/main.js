import * as React from 'react';
import BarElem from './components/listBar';
import Listoflists from './components/listOflist';
import NewListData from './components/newlistname';
import ShowListData from './addElemList';
import Authentication from './authentication';
import AddProducts from './search';
import Cookies from 'universal-cookie';
import
{
    Routes,
    Route
} from "react-router-dom";

export default function Main(props)
{
    const [ListName, setListName] = React.useState(null);

    const sentListName = name =>
    {
        setListName(name);
        const cookies = new Cookies();
        cookies.set('current_list', name, { path: '/' });
    }

    return (
        <div className="main">
            <Routes>
                <Route path="list-of-lists" element=
                    {
                        <div>
                            <BarElem />
                            <Listoflists currentlist={sentListName} />
                            <NewListData currentlist={sentListName} />
                        </div>
                    } />
                <Route path="show-list" element={<ShowListData listname={ListName} />} />
                <Route path="/" element={<Authentication />} />
                <Route path="search" element={<AddProducts />} />
            </Routes>
        </div>
    );
}


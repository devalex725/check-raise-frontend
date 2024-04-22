import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function TableRows({ rows, tableRowRemove, onValUpdate, addRowTable, }) {
   
    var [breakValue,setBreakValue]=useState('')
    const changeHandler = () => {
        
        // console.log("make it false",e.target.value);
        setBreakValue(!breakValue)
       
    };
  
    return rows.map((rowsData, index) => {
        const { SB, BB, Ante, Duration } = rowsData;
       
        return (
            <tr key={index}>
                <td >
                    {index+1}
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        onChange={(event) => onValUpdate(index, event)}
                        name="sb"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        onChange={(event) => onValUpdate(index, event)}
                        name="bb"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        onChange={(event) => onValUpdate(index, event)}
                        name="ante"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                         type="number"
                         pattern="[0-9]"
                        onChange={(event) => onValUpdate(index, event)}
                        name="duration"
                        className="form-control"
                    />
                </td>
                <td>
                    <Form.Check
                        type="checkbox"
                        id="default-checkbox"
                        label=""
                        // // name="isbreak"
                        value={breakValue ? 0 : 1}
                        // checked={breakValue ? true : false}
                        
                        onChange={changeHandler}
                    />
                </td>

                <td>
                    <span
                        className="btn btn-white"
                        onClick={() => addRowTable(index)}
                    >+</span>

                    <span
                        className="btn btn-white"
                        onClick={() => tableRowRemove(index)}
                    >-</span>
                </td>
            </tr>
        );
    });
}
function Table(props) {
    
   

    const [rows, initRow] = useState([]);
   
    const addRowTable = () => {

        const data = {
            sb: "",
            bb: "",
            ante: "",
            duration: "",
            order:JSON.stringify(rows.length),
            isbreak:0,
            breaktitle:''
            
        };
      
        
         initRow([...rows,data]);
        
      
      
    };
    const tableRowRemove = (index,e) => {
        const datarows = [...rows];
        datarows.splice(index, 1);
        initRow(datarows);
    };
    const onValUpdate = (i, event) => {
        const { name, value } = event.target;
        
        const data = [...rows];
       
        data[i][name] = value;
        initRow(data);
        props.parentCallback(data);
    };
    const { t } = useTranslation();
    return (
        <>
            <div className="table-responsive">
                <table className="table dynamic-field-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.SB')}</th>
                            <th>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.BB')}</th>
                            <th>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Ante')}</th>
                            <th>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Duration')}</th>
                            <th>{t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Break')}</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        <TableRows
                            //rows={rows?rows:structuredata}
                            rows={rows}
                            addRowTable={addRowTable}
                            tableRowRemove={tableRowRemove}
                            onValUpdate={onValUpdate}
                        />
                    </tbody>
                </table>
            </div>
            <div className="text-end">
                <Link className="btn btn-primary" onClick={addRowTable}>
                    {t('page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.AddRow')}
                </Link>
            </div>
        </>
    );
}
export default Table;
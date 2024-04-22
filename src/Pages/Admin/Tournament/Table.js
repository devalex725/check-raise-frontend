import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function TableRows({ rows, tableRowRemove, onValUpdate, addRowTable, }) {

    var [breakValue, setBreakValue] = useState(true);
    const changeHandler = (e, index) => {

        rows.map((element, i) => {
            if (e.target.checked === true) {
                if (i === index)
                    element.isbreak = 1
            } else {
                if (i === index)
                    element.isbreak = 0
            }
        });

    };

    return rows.map((rowsData, index) => {
        const { SB, BB, Ante, Duration } = rowsData;

        return (
            <tr key={index}>
                <td >
                    {index + 1}
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        defaultValue={rowsData.sb}
                        onChange={(event) => onValUpdate(index, event)}
                        name="sb"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        defaultValue={rowsData.bb}
                        onChange={(event) => onValUpdate(index, event)}
                        name="bb"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        defaultValue={rowsData.ante}
                        onChange={(event) => onValUpdate(index, event)}
                        name="ante"
                        className="form-control"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        pattern="[0-9]"
                        defaultValue={rowsData.duration}
                        onChange={(event) => onValUpdate(index, event)}
                        name="duration"
                        className="form-control"
                    />
                </td>
                <td>

                    <Form.Check
                        type="checkbox"
                        defaultChecked={rowsData.isbreak === 1 ? true : false}
                        value={breakValue}
                        label=""
                        onChange={(e) => changeHandler(e, index)}
                        id="default-checkbox"
                        name="isbreak"
                    />
                </td>

                <td>
                    <span
                        className="btn btn-white"
                        onClick={() => addRowTable(index)}
                    >+</span>

                    <span
                        className="btn btn-white"
                        // value={JSON.stringify(rowsData.order)}
                        onClick={() => tableRowRemove(index)}
                    >-</span>
                </td>
            </tr>
        );
    });
}
function Table(props) {

    var structuredata = [];
    const [rowsData, initRow] = useState([]);
    useEffect(() => {
        structuredata = props.structure;

        initRow(structuredata);
    });

    const addRowTable = () => {

        const data = {
            sb: "",
            bb: "",
            ante: "",
            duration: "",
            order: rowsData.length,
            isbreak: 0,
            breaktitle: ''

        };

        rowsData.push(data);
        initRow(rowsData);
    };
    const tableRowRemove = (index, e) => {

        rowsData.splice(index, 1);

        initRow([rowsData]);

    };
    const onValUpdate = (i, event) => {

        const { name, value } = event.target;

        const data = [...rowsData];
        
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
                            rows={rowsData}
                            //rows={structuredata}
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
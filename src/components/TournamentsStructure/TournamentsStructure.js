import React from 'react';

import {Table} from 'react-bootstrap';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {useTranslation} from 'react-i18next';

const TournamentsStructure = (props) => {
  const {t} = useTranslation();

  return (
    <>
      <div className='tournament-description-group d-flex justify-content-center'>
        <div className='tournament-description-stack tournament-description-group-block'>
          <div className='text-nowrap d-block text-center'>
              <span
                className="d-block tournament-description-label">{t('page.tournaments.tournamentstable.Playersmodal.Starting Stack')}</span>
            <span className="d-block tournament-description-value">{props.data.startingstack}</span>
          </div>
        </div>
        <div className='tournament-description-level  tournament-description-group-block'>
          <div className='text-nowrap d-block text-center'>
              <span
                className="d-block tournament-description-label">{t('page.tournaments.tournamentstable.Playersmodal.Level duration')}</span>
            <span className="d-block tournament-description-value">{props.data.level_duration}</span>
          </div>
        </div>
      </div>
      <Table responsive className='tournament-row'>
        <thead>
        <tr>
          <th>{t('page.tournaments.tournamentstable.Playersmodal.Level')}</th>
          <th className="text-center">{t('page.tournaments.tournamentstable.Playersmodal.SB')}</th>
          <th className="text-center">{t('page.tournaments.tournamentstable.Playersmodal.BB')}</th>
          <th className="text-center">{t('page.tournaments.tournamentstable.Playersmodal.Ante')}</th>
          <th className="text-center">{t('page.tournaments.tournamentstable.Playersmodal.Duration [min]')}</th>
        </tr>
        </thead>
        <tbody>
        {props.structure.map((element, index) => (
          <tr key={index}>
            {element.isbreak === 1
              ? <>
                <td className="text-center">Break</td>
                <td className='text-center'></td>
                <td className="text-center">{element.breaktitle ? element.breaktitle : ''}</td>
                <td className="text-center"></td>
                <td className="text-center">{element.duration ? element.duration : ''}</td>
              </>
              : <>
                <td className="text-center">{index + 1}.</td>
                <td className="text-center">{element.sb ? element.sb : ''}</td>
                <td className="text-center">{element.bb ? element.bb : ''}</td>
                <td className="text-center">{element.ante ? element.ante : ''}</td>
                <td className="text-center">{element.duration ? element.duration : ''}</td>
              </>}
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
};

export default TournamentsStructure;
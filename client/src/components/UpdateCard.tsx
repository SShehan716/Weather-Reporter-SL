import React from 'react';
import styles from './UpdateCard.module.css';

export interface Update {
  id: number;
  locationName: string;
  temperature?: number;
  conditions?: string;
  disasterType?: string;
  imageUrl?: string;
  createdAt: string;
  type: 'general' | 'risk';
  authorName: string;
  distance?: number;
}

interface UpdateCardProps {
  update: Update;
  style?: React.CSSProperties;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update, style }) => {
  const isRisk = update.type === 'risk';

  return (
    <div className={styles.updateCard} style={style}>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h4 className={`${styles.cardType} ${isRisk ? styles.risk : styles.general}`}>
            {isRisk ? 'Risk Alert' : 'Weather Update'}
          </h4>
          {update.distance != null && (
            <span className={styles.distance}>
              {update.distance.toFixed(1)}km away
            </span>
          )}
        </div>

        <h5 className={styles.locationName}>{update.locationName}</h5>
        
        <div className={styles.details}>
          {isRisk ? (
            <>
              <p>Type: {update.disasterType}</p>
              {update.imageUrl && (
                <img src={update.imageUrl} alt={update.disasterType} className={styles.riskImage} />
              )}
            </>
          ) : (
            <>
              {update.temperature !== undefined && <p>Temperature: {update.temperature}°C</p>}
              {update.conditions && <p>Conditions: {update.conditions}</p>}
            </>
          )}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <span>By @{update.authorName}</span>
        <span>{new Date(update.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default UpdateCard; 
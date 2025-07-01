import React from 'react';
import { Card, IconClock, IconLocation, IconLinkExternal, IconCogwheel } from 'hds-react';

import type Roadwork from '../types/Roadwork';

interface RoadworkCardProps {
  roadwork: Roadwork;
}

const RoadworkCard: React.FC<RoadworkCardProps> = ({ roadwork }) => {
  const { title, description, url, location, schedule } = roadwork;

  return (
    <Card>
      <div className="roadwork-card">
        <div className="roadwork-card__header">
          <IconCogwheel aria-hidden="true" />
          <h3 className="roadwork-card__title">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hds-link hds-link--external"
              >
                {title}
                <IconLinkExternal aria-hidden="true" />
                <span className="visually-hidden"> (avautuu uudessa välilehdessä)</span>
              </a>
            ) : (
              title
            )}
          </h3>
        </div>

        {description && (
          <div className="roadwork-card__description">
            <p>{description}</p>
          </div>
        )}

        <div className="roadwork-card__details">
          {location && (
            <div className="roadwork-card__detail">
              <IconLocation aria-hidden="true" />
              <span>{location}</span>
            </div>
          )}
          
          {schedule && (
            <div className="roadwork-card__detail">
              <IconClock aria-hidden="true" />
              <span>{schedule}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RoadworkCard;

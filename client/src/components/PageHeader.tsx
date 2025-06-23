import React from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default PageHeader; 
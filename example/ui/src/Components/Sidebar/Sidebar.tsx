import Icon from "../../../../../src/Canvas/Icon/Icon";
import styles from "./Sidebar.module.css";

export const Sidebar = ({ add, save }) => {
  return ( 
    <div className={styles.sidebar}>
      <Item icon="plus-circle" onClick={add}>
        Add
      </Item>
      <Item icon="save" onClick={save}>
        Save
      </Item>
    </div>
  );
};

const Item = ({ icon, onClick, children }) => {
  return (
    <div className={styles.Item} onClick={onClick}>
      <Icon icon={icon} size={20} className={styles.Icon} />
    </div>
  );
};

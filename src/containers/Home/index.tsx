import { SearchBar } from 'antd-mobile';
import { useState } from 'react';
import TypeSelect from './components/TypeSelect';

import style from './index.module.less';
import ProductList from './components/ProductList';

/**
* 精选课程
*/
const Home = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const onSearchHandler = (val: string) => {
    setName(val);
  };

  const onTypeChangeHandler = (key: string) => {
    setType(key);
  };

  return (
    <div className={style.container}>
      <SearchBar
        placeholder="搜索课程试试"
        onSearch={onSearchHandler}
      />
      <TypeSelect onChange={onTypeChangeHandler} />
      <ProductList name={name} type={type} />
    </div>
  );
};

export default Home;

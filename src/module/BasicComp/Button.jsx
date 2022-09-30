import styled from "styled-components";

const Btn = styled.div`
  display: inline-block;
  padding: 1px 5px;
  margin: 0px 5px;
  background-color: #fff;
  color: rgb(35, 49, 53);
  cursor: pointer;
  border-radius: 2px;
  box-shadow: 0px 0px 2px rgb(159, 159, 159);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Button = ({ name, ...attr }) => {
  return (
    <Btn id="upload-btn" {...attr}>
      <a className="button-wrap">
        <div>{name}</div>
      </a>
    </Btn>
  );
};

export default Button;

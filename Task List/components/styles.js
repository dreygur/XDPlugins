module.exports =  /*css*/ `

.to-do-item {
  align-items: center; 
  padding: 8px 0px 10px 0px;
  position: relative;
  border-bottom: 1px solid #ddd;
  width: 100%;
}

.to-do-item:last-child {
  padding-bottom: 0px;
}

.item-container {
  display: flex;
}

.move-parent {
  width: 12px;
  position: relative;
  top: 1px;
  opacity: 0.4;
}

.move-parent img:hover {
  opacity: 0.6;
}
.to-do-item:last-child {
  border-bottom: none;
}

.to-do-item:first-child .move.up {
  display: none;
}

.to-do-item:first-child .move.down img {
  top: 8px;
  position: absolute;
  cursor: pointer;
}

.to-do-item:last-child .move.up img {
  top: 8px;
  position: absolute;
  cursor: pointer;
}

.to-do-item:last-child .move.down {
  display: none;
}

.checklist-group {
  display: flex; 
  align-content: flex-start;
  align-items: flex-start;
}

.title {
  padding: 0px 0px 10px 0px;
  font-size: 22px;
}

.task-list {
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 12px;
  width: 100%;
}

.to-do-item label{
  color: black;
  font-size: 12px;
  top: 3px;
  line-height: 18px;
  width: calc(100% - 40px);
  position: relative;
}

.to-do-item.is-checked label {
  color: #aaa;
}

.delete {
  opacity: 0;
  font-size: 8px;
  color: #aaa;
  right: 0;
  text-align: right;
  position: absolute;
  z-index: 99;
  top: 8px;
  padding: 4px;
  background: #EEE;
}

.delete:hover {
  background: #E1E1E1;
}

.to-do-item:hover .move-parent {
  opacity: 1;
}

.to-do-item:hover .delete {
  opacity: 1;
}

.to-do-item:hover .delete:hover {
  color: #000;
}

.to-do-parent {
  overflow: auto;
  position: relative;
  width: 100%;
  overflow: auto;
}

.action-group {
  position: relative;
  width: 100%;
  padding: 0px 5px;
}

.action-group input {
  width: 100%;
}

.to-do-parent__inner {
  padding: 0px 5px 0px 5px;
}

.outer-most {
  position: relative;
}

.checklist-group {
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
}

/* .switch-parent {
  display: flex;
  align-items: center;
} */

.switch {
  background: #5187F6;
  height: 12px;
  width: 30px;
  border-radius: 6px;
  position: relative;
  margin-top: 4px;
  /* margin-left: 8px; */
}

.switch.is-on .switch-ball {
  transform: translate(150%, -50%);
}
.switch-ball {
  height: 12px;
  width: 12px;
  background: #FFFFFF;
  border: 1px solid #CBCBCB;
  border-radius: 100%;
  position: absolute;
  top: 50%; left: 0;
  transform: translate(0%, -50%);
  transition: transform 400ms ease;
}

@media(max-width: 300px) {
  .title {
    font-size: 14px;
  }

  .to-do-item label{
    font-size: 12px;
  }
}

`
import express  from "express";

import SearchController from '@controllers/search.controller';
import validator from "@middlewares/validator.middleware";
import {createSearch,updateSearch,deleteSearch} from "@validators/search.validator"
const route=express.Router();

route.get('/search', SearchController.search);
route.get('/datatable',SearchController.datatable)
route.get('/count',SearchController.count)
route.get('/',SearchController.getSearchs)
route.get('/:id',SearchController.getSearch)
route.post('/',validator(createSearch),SearchController.createSearch)
route.patch('/:id',validator(updateSearch),SearchController.updateSearch)
route.delete('/:id',validator(deleteSearch),SearchController.deleteSearch)

export default route;

